## hotel-backend-test

This is a backend for the test task

Stack: [Node](https://nodejs.org/en/), [Nest.js](https://nestjs.com/), [PostgreSQL](https://www.postgresql.org/), 

### Deploy

Local PostgreSQL installation is required

PostgreSQL can be installed on MacOS with Brew:
https://gist.github.com/peterdee/087dae4bb1ed7937c6f1d650059113fe

Install PostgreSQL on Ubuntu:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04

After the installation you should create a role that is going to be used for the database access:

```shell script
sudo -u postgres createuser --interactive

Enter name of role to add: <ROLE NAME>
Shall the new role be a superuser? (y/n) <YES>
```

Created role should be a superuser

After creating a role, you should create a default database for that role:

```shell script
createdb <ROLE NAME>
```

After that, you should set a password for the created role via `psql`:

```shell script
psql

ALTER ROLE <ROLE NAME> WITH ENCRYPTED PASSWORD '<PASSWORD>';
```

Clone the project and install the dependencies:

```shell script
git clone https://github.com/Kazakova-A/hostel-backend-test.git
cd ./hostel-backend-test
nvm use 14
npm i
```

### Environment

The `.env` file is required, see the [.env.example](.env.example) for details

### Launch (development)
Run the server in a terminal:

```shell script
npm run start:dev
```

### Testing

Runs all of the available tests:

```shell script
npm run test
```
If some of the tests are not passing (this can be the case if you tried to run the tests before the synchronization), you can drop the database, run the synchronization script, and then run the tests again

### Database

See the [DATABASE.md](DATABASE.md) for details
