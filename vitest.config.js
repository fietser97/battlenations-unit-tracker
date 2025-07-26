export default {
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['vitest/**/*.test.js'], // Only run Vitest tests from test/
    },
}