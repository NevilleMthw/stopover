package api

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"stopover-go/config"
	"stopover-go/internal/api/handler"
	"stopover-go/internal/api/route"
	"stopover-go/internal/repository"
	"stopover-go/pkg/aviasales"

	// _ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
)

func StartServer() {
	// Load configuration
	cfg := config.AppConfig

	rootCtx, cancelFunc := context.WithCancel(context.Background())
	defer cancelFunc()

	// // init redis db
	// rdb, err := cache.NewRedisClient(rootCtx, cfg)
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }

	// cSvc := cache.NewCacheService(rdb, cfg)

	// init postgres db
	dbConn, err := repository.NewPostgres(context.Background(), cfg)
	if err != nil {
		log.Fatal(err.Error())
	}

	// run db migrations
	// err = runDbMigrations(cfg)
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }

	// hndlr := handler.NewUserHandler(
	// 	services.NewService(
	// 		repository.NewRepository(
	// 			dbConn), jwtutil.NewTokenService(cfg)))

	//tokensvc := jwtutil.NewTokenService(cfg)

	// cache
	// err = uploadRoleAccessMappingToCache(rootCtx, repository.NewUserRepository(dbConn), cSvc)
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }

	// // set up middleware
	// mw := middleware.NewAuthRepo(repository.NewUserRepository(dbConn), cSvc)
	f_client := aviasales.NewFlightIntegrationClient(cfg.AviaSalesConfig.AviaSalesToken,
		cfg.AviaSalesConfig.AviaSalesMarker,
		cfg.AviaSalesConfig.AviaSalesHost, &cfg)

	f_hnldr := handler.NewFlightHandler(f_client, &cfg)

	// Set up routes
	router := route.SetupRouter(f_hnldr, &cfg)
	srv := &http.Server{
		Addr:    ":8084",
		Handler: router.Handler(),
	}
	// Start the server
	startHttpServer(srv)

	initGracefulShutdown(cancelFunc, dbConn, srv)
	<-rootCtx.Done()
}

func initGracefulShutdown(cancelFunc context.CancelFunc, dbConn *pgxpool.Pool, srv *http.Server) {

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no params) by default sends syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// close db connection
	dbConn.Close()

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

// func uploadRoleAccessMappingToCache(ctx context.Context, userRepo repository.UserRepository, cSvc cache.CacheService) error {

// 	rAMapping, err := userRepo.GetRoleAccessMapping(ctx)
// 	if err != nil {
// 		return err
// 	}

// 	for _, v := range rAMapping.RoleAccess {
// 		err = cSvc.SetValues(ctx, strconv.Itoa(int(v.RoleId)), v.Access)
// 		if err != nil {
// 			return err
// 		}
// 	}

// 	return nil

// }

// func runDbMigrations(cfg config.Config) error {
// 	dbURL := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s", cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
// 	dbDriver, err := sql.Open("pgx", dbURL)
// 	if err != nil {
// 		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
// 	}
// 	defer dbDriver.Close()
// 	db, err := pgx.WithInstance(dbDriver, &pgx.Config{})
// 	if err != nil {
// 		return err
// 	}

// 	m, err := migrate.NewWithDatabaseInstance("file://db/migrations", cfg.DBName, db)
// 	if err != nil {
// 		return err
// 	}

// 	err = m.Up()
// 	if err != nil {
// 		if err == migrate.ErrNoChange {
// 			log.Println("No new migrations to apply.")
// 			return nil
// 		} else {
// 			log.Printf("Error applying migrations: %v", err)
// 		}
// 		return err
// 	}
// 	log.Println("Migrations applied successfully.")
// 	return nil
// }
