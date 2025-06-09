PKG_NAME			:= wp-flexible-map
PKG_VERSION			:= $(shell sed -rn 's/^Version: (.*)/\1/p' flexible-map.php)

ZIP					:= .dist/$(PKG_NAME)-$(PKG_VERSION).zip
FIND_PHP			:= find . -path ./vendor -prune -o -path ./node_modules -prune -o -path './.*' -o -name '*.php'
SRC_PHP				:= $(shell $(FIND_PHP) -print)

# environment variables for unit tests
export WP_PLUGIN_DIR	= $(shell cd ..; pwd)

.PHONY: all lint lint-php zip wpsvn

all:
	@echo please see Makefile for available builds / commands

# release product

zip: $(ZIP)

$(ZIP): $(SRC_PHP) .make-flag-js *.md *.txt
	rm -rf .dist
	mkdir .dist
	git archive HEAD --prefix=$(PKG_NAME)/ --format=zip -9 -o $(ZIP)

# WordPress plugin directory

wpsvn: lint
	svn up .wordpress.org
	rm -rf .wordpress.org/trunk
	mkdir .wordpress.org/trunk
	git archive HEAD --format=tar | tar x --directory=.wordpress.org/trunk

# build JavaScript targets

JS_SRC_DIR		:= source/js
JS_TGT_DIR		:= static/js
JS_SRCS			:= $(shell find $(JS_SRC_DIR) -name '*.js' -print)
JS_TGTS			:= $(subst $(JS_SRC_DIR),$(JS_TGT_DIR),$(JS_SRCS))

js: .make-flag-js

.make-flag-js: $(JS_TGTS)
	@touch .make-flag-js

$(JS_TGTS): $(JS_TGT_DIR)/%.js: $(JS_SRC_DIR)/%.js
	npx babel --source-type script --presets @babel/preset-env --out-file $@ $<
	npx uglify-js $@ --output $(basename $@).min.js -b beautify=false,ascii_only -c -m --comments '/^!/'

# code linters

lint: lint-js lint-php

lint-js:
	@echo JavaScript lint...
	@npx eslint $(JS_SRC_DIR)

lint-php:
	@echo PHP lint...
	@$(FIND_PHP) -exec php7.4 -l '{}' \; >/dev/null
	@$(FIND_PHP) -exec php8.4 -l '{}' \; >/dev/null
	@vendor/bin/phpcs -ps
	@vendor/bin/phpcs -ps --standard=phpcs-5.2.xml

