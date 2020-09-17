# reactivelite

reactivelite is a lightweight JavaScript reactivity system.

## Installation

```bash
npm install reactivelite
```

or

```bash
yarn add reactivelite
```

## Usage

```javascript
import { ref, computed, watch, watchEffect } from 'reactivelite';

const counter = ref(0);
const twoTimesCounter = computed(() => counter.value * 2);

watchEffect(() => {
    console.log('2 * counter =', twoTimesCounter.value);
});

setInterval(() => { counter.value++; }, 1000);


const msg = ref('hello, world!');

watch(
    () => msg.value,
    (newMsg, oldMsg) => console.log('message changed!')
);

setTimeout(() => { msg.value = 'new messsge!'; }, 5000);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)