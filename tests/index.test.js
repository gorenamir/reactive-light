import { ref, computed, reactive, watch, watchEffect } from '../src/index';

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
    const msg = ref('hello, world!');
    let numOfInvocations = 0;
    watchEffect(() => {
        const rawMsg = msg.value;
        numOfInvocations++;
    });
    msg.value += '!';
    msg.value += '!';
    msg.value += '!';

    expect(numOfInvocations).toBe(4);
});

test('reactive functionality works', () => {
    const state = reactive({
        counter: 0,
        user: { name: 'Amir' }
    })

    let numOfInvocations = 0;
    watchEffect(() => {
        const counter = state.counter;
        const name = state.user.name;
        numOfInvocations++;
    });

    state.counter++;
    state.counter--;
    state.counter++;
    expect(numOfInvocations).toBe(4);

    state.user.name += ' Goren';
    expect(numOfInvocations).toBe(5);

    state.user.age = 27;
    expect(numOfInvocations).toBe(6);

    state.user.contact = {
        phone: '+972-3555-4265'
    };
    expect(numOfInvocations).toBe(7);

    watchEffect(() => {
        const phone = state.user.contact.phone;
        numOfInvocations++;
    })
    expect(numOfInvocations).toBe(8);

    state.user.contact.phone = '+972-3555-5497';
    expect(numOfInvocations).toBe(9);

    delete state.user.contact.phone;
    expect(numOfInvocations).toBe(10);

    expect(state.user.contact.phone).toBeUndefined();
});
