const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Counter", function () {
    async function deployFixture() {
        const [owner, other] = await ethers.getSigners();
        const Counter = await ethers.getContractFactory("Counter");
        const counter = await Counter.deploy();
        await counter.waitForDeployment();
        return { counter, owner, other };
    }

    it("starts at 0", async function () {
        const { counter } = await loadFixture(deployFixture);
        expect(await counter.getCount()).to.equal(0n);
    });

    it("increment() increases count by 1", async function () {
        const { counter } = await loadFixture(deployFixture);

        await (await counter.increment()).wait();
        expect(await counter.getCount()).to.equal(1n);
    });

    it("multiple increment() calls accumulate correctly", async function () {
        const { counter } = await loadFixture(deployFixture);

        const N = 10n;
        for (let i = 0; i < Number(N); i++) {
            await (await counter.increment()).wait();
        }
        expect(await counter.getCount()).to.equal(N);
    });

    it("decrement() decreases count by 1 when count > 0", async function () {
        const { counter } = await loadFixture(deployFixture);

        await (await counter.increment()).wait(); // count = 1
        await (await counter.decrement()).wait(); // count = 0

        expect(await counter.getCount()).to.equal(0n);
    });

    it("decrement() reverts with message when count == 0", async function () {
        const { counter } = await loadFixture(deployFixture);

        await expect(counter.decrement()).to.be.revertedWith("Counter: underflow");
    });

    it("round-trip: increment twice then decrement once => count == 1", async function () {
        const { counter } = await loadFixture(deployFixture);

        await (await counter.increment()).wait(); // 1
        await (await counter.increment()).wait(); // 2
        await (await counter.decrement()).wait(); // 1

        expect(await counter.getCount()).to.equal(1n);
    });

    it("independent of caller: any account can increment/decrement", async function () {
        const { counter, other } = await loadFixture(deployFixture);

        await (await counter.connect(other).increment()).wait();
        expect(await counter.getCount()).to.equal(1n);

        await (await counter.connect(other).decrement()).wait();
        expect(await counter.getCount()).to.equal(0n);
    });
});
