import { ref, computed, watch, watchEffect } from '../src/index';

test('counter is equal to 0', () => {
    const counter = ref(0);
    expect(counter.value).toBe(0);
});

