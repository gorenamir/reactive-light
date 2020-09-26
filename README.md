# reactive-light

reactive-light is a lightweight JavaScript reactivity system.

## Installation

```bash
npm install reactive-light
```

or

```bash
yarn add reactive-light
```

## Usage

```javascript
import { ref, computed, reactive, watch, watchEffect } from 'reactive-light';

const counter = ref(0);
const twoTimesCounter = computed(() => counter.value * 2);

watchEffect(() => {
    console.log('2 * counter =', twoTimesCounter.value);
});

setInterval(() => { counter.value++; }, 1000);


const state = reactive({
    msg: 'hello, world!'
});

watch(
    () => state.msg,
    (newMsg, oldMsg) => console.log('message changed!')
);

setTimeout(() => { state.msg = 'new message!'; }, 5000);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)