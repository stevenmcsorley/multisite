#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE baby_names;
    CREATE DATABASE site2_db;
    CREATE DATABASE site3_db;
EOSQL
