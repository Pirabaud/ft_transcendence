build:
	sudo docker-compose -f docker-compose.yml up --build

start: 
	sudo docker-compose -f docker-compose.yml up

stop:
	sudo docker-compose -f docker-compose.yml stop

restart: stop start

clean: stop
	sudo docker system prune -af
	sudo docker volume prune -af

status:
	docker ps
	@echo "\n"
	docker images
	@echo "\n"
	docker volume ls
	@echo "\n"
	docker network ls

re:	stop clean build start
