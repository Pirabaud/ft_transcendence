start:
	docker-compose up --build

stop:
	docker-compose stop

restart: stop start

build:
	docker-compose build

clean: stop
	sudo docker system prune -af
	sudo docker volume prune -af

status:
	sudo docker ps
	@echo "\n"
	sudo docker images
	@echo "\n"
	sudo docker volume ls
	@echo "\n"
	sudo docker network ls

re:	stop clean build start
