start:
	docker-compose up --build

stop:
	docker-compose stop

restart: stop start

build:
	docker-compose build

clean: stop
	docker system prune -af
	docker volume prune -af

status:
	docker ps
	@echo "\n"
	docker images
	@echo "\n"
	docker volume ls
	@echo "\n"
	docker network ls

re:	stop clean build start
