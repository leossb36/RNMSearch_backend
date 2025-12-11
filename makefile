.PHONY: build-env tests docker-up docker-down docker-logs docker-build docker-restart clean

build-env:
	@echo "Building environment..."
	npm install
	@echo "Init husky config..."
	@npm run prepare
	@echo "Environment built."

tests:
	@echo "Running unit tests"
	@echo "=========================================="
	@npm run test:unit
	@echo "=========================================="
	@echo "All tests completed"

# Docker commands
docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	@echo "Containers started successfully!"

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down
	@echo "Containers stopped successfully!"

docker-logs:
	@echo "Showing container logs..."
	docker-compose logs -f

docker-build:
	@echo "Building and starting containers..."
	docker-compose up -d --build
	@echo "Build and start completed!"

docker-restart: docker-down docker-build

clean:
	@echo "Cleaning up..."
	rm -rf node_modules dist
	@echo "Cleanup completed!"

# Development commands
dev:
	@echo "Starting development server..."
	npm run start:dev

build:
	@echo "Building application..."
	npm run build
	@echo "Build completed!"

lint:
	@echo "Running linter..."
	npm run lint

format:
	@echo "Formatting code..."
	npm run format:all
