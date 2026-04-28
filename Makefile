.PHONY: audit build check check-env ci deploy-walrus-testnet dev smoke test test-contracts test-frontend

check:
	cd frontend && npm run typecheck
	cd frontend && npm run test:run
	cd contracts && sui move build

test: test-frontend test-contracts

test-frontend:
	cd frontend && npm run test:run

test-contracts:
	cd contracts && sui move test

ci:
	cd frontend && npm run typecheck
	cd frontend && npm run test:run
	cd frontend && npm run build
	cd contracts && sui move test

dev:
	cd frontend && npm run dev

build:
	./scripts/build-frontend.sh

check-env:
	./scripts/check-env.sh

deploy-walrus-testnet:
	./scripts/build-frontend.sh
	./scripts/deploy-walrus-site.sh

audit:
	cd frontend && npm audit --omit=dev

smoke:
	cd frontend && npm run build
	cd contracts && sui move build
