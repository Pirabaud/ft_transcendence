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
	sudo docker ps
	@echo "\n"
	sudo docker images
	@echo "\n"
	sudo docker volume ls
	@echo "\n"
	sudo docker network ls

re:	stop clean build start
