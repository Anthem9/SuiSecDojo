.PHONY: audit build check check-env ci deploy-walrus-mainnet deploy-walrus-testnet dev mainnet-dry-run smoke smoke-chain test test-contracts test-contracts-mainnet test-frontend

check:
	cd frontend && npm run typecheck
	cd frontend && npm run test:run
	cd contracts && sui move build

test: test-frontend test-contracts

test-frontend:
	cd frontend && npm run test:run

test-contracts:
	cd contracts && sui move test

test-contracts-mainnet:
	cd contracts-mainnet && sui move test

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

deploy-walrus-mainnet:
	./scripts/build-frontend.sh
	./scripts/deploy-walrus-mainnet-site.sh

mainnet-dry-run:
	./scripts/publish-dojo-pass-mainnet.sh

audit:
	cd frontend && npm audit --omit=dev

smoke:
	cd frontend && npm run build
	cd contracts && sui move build

smoke-chain:
	./scripts/smoke-chain.sh
