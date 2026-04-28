.PHONY: check test test-frontend test-contracts ci smoke

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

smoke:
	cd frontend && npm run build
	cd contracts && sui move build

