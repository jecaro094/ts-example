# SRC=$(CURDIR)/src
# TESTS=$(CURDIR)/tests

build:
	./node_modules/.bin/tsc

live:
	tsc -w

run:
	node ./dist/index.js

all: build run