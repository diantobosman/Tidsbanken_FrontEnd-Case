
# Noroff Bootcamp Tidsbanken Case Project: Vacation management system.
[![web](https://img.shields.io/static/v1?logo=heroku&message=Online&label=Heroku&color=430098)](https://tidsbanken-case.herokuapp.com/login)

## Assignment
Tidsbanken have approached the candidates and requested that a solution for managing
requests for vacation time for their employees. The application serves a dual purpose.
Firstly, it serves to manage the request and approval process of vacation days for employees and ease the burden of communication. Secondly, the application serves to inform employees about each other’s approved vacation days so that teams may adequately plan for periods of absence.

## How It Works
Both the front-end and back-end are uploaded on heroku. This repository is the front-end part of the product. It uses the API-endpoints of the repository below:

[Noroff Bootcamp Tidsbanken Case API](https://github.com/savannah-borst/Tidsbanken-case-API)

## How To Use
The above also requires the back-end api. Click the above link for futher instructions to set that up. This repository can be cloned using: <br />

```git clone https://github.com/diantobosman/Tidsbanken_FrontEnd-Case.git```

The front-end needs npm to run: <br />
```npm install``` <br />

To run the application one can use the command: <br />
```ng serve```


## How To Login

The user can login as user with: <br />
Username: testuser <br />
Password: 1234

And as admin using: <br />
Username: testadmin <br />
Password: 12345

## Future
Future work may include:

- 2FA-login
- Solving the bug that the calendar has to be reloaded in order to see the vacations
- Use the settings from the created API in the front-end, to create a maximum number of vacation per employee and also to add the constraint of a maximum of contiguous days of vacation.

## Documentation
Further documentation such as wireframes, diagrams, component tree and user manual can be found in de src/assets/exports folder of the application.

## Built With
[IntelliJ IDEA](https://www.jetbrains.com/idea/)

[Spring Framework](https://spring.io/)

[Hibernate](https://hibernate.org/)

[PostgreSQL](https://www.postgresql.org/)

[Swagger](https://swagger.io/)

[Docker](https://www.docker.com/)

[Heroku](https://www.heroku.com/)

[Angular](https://angular.io/)

[Visual Studio Code](https://code.visualstudio.com/)

[Bootstrap](https://getbootstrap.com/)

[Material UI](https://material.angular.io/)

## Credits
[Dianto Bosman](https://github.com/diantobosman)

[Iljaas Dhonre](https://github.com/iljaasdhonre)

[Savannah Borst](https://github.com/savannah-borst)

## Acknowledgment
[Dean von Schoultz](https://gitlab.com/deanvons) who is the tutor of the Frontend course at Noroff.

## License
[MIT](https://choosealicense.com/licenses/mit/)
