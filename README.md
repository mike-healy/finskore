# Finskore – Score games of Finksa, Klop or Molkky
![Finskore Banner Graphic](https://www.finskore.com/img/banner.png)

Are you sick of have to remember numbers, and worse still add number together and subtract the sum of those numbers from 50 in your head, while you're just trying to enjoy throwing a stick at other sticks with numbers on them?
Of course you are. It's terrible.

Finskore is a simple client side app (site) to do all that number stuff for you, as well as the name stuff, the whose turn is it stuff, and the how many strikes am I on stuff. All the boring stuff, leaving you free to focus on stick tossing.

Throw it on a web server (static object server is fine) and have at it.

**[Live Demo](https://www.finskore.com/)**

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

Tested on Node v14.14.0

## Service Worker
Finskore now has a service worker to cache assets for offline loading.
After deploying changes update the cache version in `service-worker.js`

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
