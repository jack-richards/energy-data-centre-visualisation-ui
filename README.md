# energy-data-centre-visualisation

## Getting started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) LTS (v20.10.0)
-   [Pnpm](https://pnpm.io/installation) (8)
-   [Redis](https://redis.io/) (7)
-   [Python 3](https://www.python.org/downloads/) (3.11)

### Clone the repositories

```shell
git clone https://github.com/jack-richards/energy-data-centre-visualisation-api.git
```
```shell
git clone https://github.com/jack-richards/energy-data-centre-visualisation-ui.git
```

### Download the dataset

You have to download and unzip the dataset files provided as part of the paper:

Canet, A., Qadrdan, M., Jenkins, N. et al. Spatial and temporal data to study residential heat decarbonisation pathways in England and Wales. Sci Data 9, 246 (2022). https://doi.org/10.1038/s41597-022-01356-9

It has a section on the data/files (which this project requires) and where to download them.

Once acquired, you must unzip and place the files into the /data directory. After, set the `DATA_DIR` environment variable to equal /data.

You may prefer setting it up on the environment variable in your IDE, or you can do it on the command line:

On Linux/MacOS:

```shell
export DATA_DIR=/data
```

On Windows:

```shell
$env:DATA_DIR = "/data"
```

### Install dependencies for the frontend

cd into the frontend directory, then run:

```shell
pnpm install
```

### Set environment variables for the frontend

For the contact form to work you will need to set the following `.env` variables with valid values:

```
NUXT_MAILHOST=?
NUXT_MAILPORT=587
NUXT_MAILUSER=?
NUXT_MAILPASSWORD=?
NUXT_CONTACTMAIL=?
```

### Run the frontend

cd into the frontend directory, then run:

```shell
pnpm dev
```

You can then access the frontend at http://localhost:3000.

### Run the frontend in production mode

cd into the frontend directory, then run:

```shell
pnpm build
node .output/server/index.mjs
```

You can then access the frontend at http://localhost:3000.

### Install dependencies for the backend

cd into the backend directory, then run:

```shell
pip install -r requirements.txt
```

### Set environment variables for the backend

Assuming you have already set the `DATA_DIR` environment variable, you must also set the following environment variables:

-   REDIS_URI - The URI of the Redis server, for example, `redis://localhost:6379`.

### Initialise the database

Assuming you have already set the `DATA_DIR` and `REDIS_URI` environment variables set,

cd into the backend directory, then run:

```shell
python initialise_csv.py
```

### Run the backend

Assuming you have already set the `DATA_DIR` and `REDIS_URI` environment variables set,

cd into the backend directory, then run:

```shell
uvicorn main:app --reload
```

This will start the backend server on port 8000 while binding to localhost.
