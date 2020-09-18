import { ref, computed, watch, watchEffect } from '../src/index';

test('computed functionality works', () => {
    const counter = ref(0);
    const twoTimesCounter = computed(() => counter.value * 2);

    expect(counter.value).toBe(0);
    expect(twoTimesCounter.value).toBe(0);

    counter.value++;

    expect(counter.value).toBe(1);
    expect(twoTimesCounter.value).toBe(2);
});

test('watch functionality works', () => {
    const msg = ref('hello, world!');
    watch(
        () => msg.value,
        (newVal, oldVal) => {
            expect(newVal).toBe('changed!');
            expect(oldVal).toBe('hello, world!');
        }
    );
    msg.value = 'changed!';
});

test('watchEffect works', () => {
    let msg = ref('hello, world!');
    let numOfInvocations = 0;
    watchEffect(() => {
        let rawMsg = msg.value;
        numOfInvocations++;
    });
    msg.value += '!';
    msg.value += '!';
    msg.value += '!';

    expect(numOfInvocations).toBe(4);
});
