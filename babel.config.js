module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'nativewind/babel',
            [
                'module-resolver',
                {
                    alias: {
                        crypto: 'react-native-quick-crypto',
                        stream: 'stream-browserify',
                        buffer: '@craftzdog/react-native-buffer',
                    },
                },
            ],
        ],
    };
};
