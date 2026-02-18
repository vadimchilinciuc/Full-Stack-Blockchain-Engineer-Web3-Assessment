// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Counter contract – assessment Part 1
 *
 * Implement:
 * - increment(): increase count by 1
 * - decrement(): decrease count by 1 (prevent underflow when count is 0)
 * - getCount(): return current count
 *
 * A reference implementation is provided below. You may replace it with your own.
 */

/*
I used a slightly different version to reduce gas usage:
- external: these functions are only meant to be called from outside the contract
- unchecked: decrement() is protected by a require, so the built-in underflow check would be redundant
*/

contract Counter {
    uint256 private _count;

    function increment() external {
        unchecked { _count += 1; }
    }

    function decrement() external {
        require(_count > 0, "Counter: underflow");
        unchecked { _count -= 1; }
    }

    function getCount() external view returns (uint256) {
        return _count;
    }
}