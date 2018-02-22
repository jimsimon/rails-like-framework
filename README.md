# Rails-Like-Framework

A framework loosely based on the simplicity and ease of use of Ruby on
Rails, but without the performance cost.

## Current Features
* A simple DSL for defining routes
* A standardized file system layout
* All classes defined in the standard file system layout available as globals
* A console for easy researching and debugging
* An ActiveRecord library for easy and simple model definitions

### Planned Features
* Built-in process clustering
* Built-in hot reloading while in development mode
* Built-in server management tools
* Built-in feature flagging system
* Built-in sharding support

## Getting Started

Simply install this package via your favorite package manager:

NPM:
```
npm install --global rlf
```

Yarn:
```
yarn global add rlf
```

### Usage
Create a new project directory, then run the init command:
```
mkdir my-cool-project
cd my-cool-project
rlf init
```

Running this command will create a basic RLF directory structure for
your application:

| Directory/File | Purpose |
| -------------- | ------- |
| <project-root>/config | Directory for all application related configuration files |
| <project-root>/config/rlf.config.js | General RLF configuration file |
| <project-root>/config/database.config.js | Database configuration file |
| <project-root>/controllers | Directory for all application controllers |
| <project-root>/models | Directory for all application models |

Each generated configuration file contain RLF's default values for that given file.

### General Configuration Options
| Setting Key | Default Value | Purpose |
| ----------- | ------------- | ------- |

### Database Configuration
Each of the following values below can be specified for development and production environments

Development:

| Setting Key | Default Value | Purpose |
| ----------- | ------------- | ------- |
| username | postgres | The username to connect to the database with |
| password | null | The password to connect to the database with |
| host | localhost | The host database is expecting connection on |
| port | 5432 | The port the database is expecting connections on |
| database | myapp | The database to connect to |

Production:

| Setting Key | Default Value | Purpose |
| ----------- | ------------- | ------- |
| username | process.env.username | The username to connect to the database with |
| password | process.env.password | The password to connect to the database with |
| host | process.env.host | The host database is expecting connection on |
| port | process.env.port | The port the database is expecting connections on |
| database | myapp | The database to connect to |

## Routing
Routes are defined in `<project root>/config/routes.js` using the following API:

### resources(name)
Parameters:
* name - the identifier to use when wiring up the controller

The `resources` function wires up the following routes to a controller class defined in
the standard controllers directory named `<name>Controller` with name being converted to
pascal-case.  For example, calling `resources('accounts')` will wire up all standard routes
to `AccountsController`.

The standard routes are as follows (using `'accounts'` as an example):
| Method | Route | Controller Function | Purpose |
| GET | /accounts | AccountsController.index | List all accounts |
| POST | /accounts | AccountsController.create | Create a new account |
| GET | /accounts/:id | AccountsController.show | Get a specific account |
| PUT | /accounts/:id | AccountsController.replace | Replace a specific account |
| PATCH | /accounts/:id | AccountsController.amend | Amend (partial update) a specific account |
| DELETE | /accounts/:id | AccountsController.destroy | Update a specific account |

### get|post|patch|put|delete(path, name, function)
Parameters:
* path - the path to respond to
* name - the identifier to use when wiring up the controller
* function - the controller function to call when the route is reached

Examples:

Routes a `GET` request to `/users/:id` to `AuthenticatedUsersController.getAuthUser`
```
get('/users/:id', 'authenticated-users', 'getAuthUser')
```

Routes a `PUT` request to `/addresses` to `AddressesController.replaceAll`
```
put('/addresses', 'addresses', 'replaceAll')
```

## CLI
For a list of the available cli commands, simply execute the following command:
```
rlf --help
```
