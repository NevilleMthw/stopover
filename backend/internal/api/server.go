package api

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"stopover.backend/config"
	"stopover.backend/internal/api/handler"
	"stopover.backend/internal/api/route"
	"stopover.backend/pkg/aviasales"
)

func StartServer() {
	// Load configuration
	cfg := config.AppConfig

	rootCtx, cancelFunc := context.WithCancel(context.Background())
	defer cancelFunc()

	fClient := aviasales.NewFlightIntegrationClient(cfg.AviaSalesConfig.AviaSalesToken,
		cfg.AviaSalesConfig.AviaSalesMarker,
		cfg.AviaSalesConfig.AviaSalesHost, &cfg)

	fHnldr := handler.NewFlightHandler(fClient, &cfg)

	// Set up routes
	router := route.SetupRouter(fHnldr, &cfg)

	port := cfg.Port
	if port == "" {
		log.Fatal("PORT environment variable is required")
	}
	if !strings.HasPrefix(port, ":") {
		port = ":" + port
	}

	srv := &http.Server{
		Addr:    port,
		Handler: router, // gin.Engine already implements http.Handler
	}
	// Start the server
	startHttpServer(srv)

	initGracefulShutdown(cancelFunc, srv)
	<-rootCtx.Done()
}

func initGracefulShutdown(cancelFunc context.CancelFunc, srv *http.Server) {

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no params) by default sends syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// shutdown server
	// stopping http server
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Println("Server Shutdown:", err)
	}

	cancelFunc()
	log.Println("Shutdown Server ...")
}

func startHttpServer(srv *http.Server) {

	go func() {
		// service connections
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()
}
