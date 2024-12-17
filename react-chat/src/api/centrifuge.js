import { Centrifuge } from 'centrifuge';

let centrifugeRef = null;
let subscriptionRef = null;

export const CentrifugeApi = {
    async connectToCentrifuge(userId, accessToken, handleIncomingMessageFunction) {
        const channel = userId;
        centrifugeRef = new Centrifuge('wss://vkedu-fullstack-div2.ru/connection/websocket/', {
            minReconnectDelay: 1000 * 60 * 50,
            getToken: (ctx) =>
                new Promise((resolve, reject) =>
                    fetch('/api/centrifugo/connect/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(ctx),
                    })
                        .then(res => res.json())
                        .then(data => resolve(data.token))
                        .catch(err => reject(err))
                )
        });

        centrifugeRef.connect();

        subscriptionRef = centrifugeRef.newSubscription(channel, {
            minResubscribeDelay: 1000 * 60 * 50,
            getToken: (ctx) =>
                new Promise((resolve, reject) =>
                    fetch('/api/centrifugo/subscribe/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(ctx),
                    })
                        .then(res => res.json())
                        .then(data => resolve(data.token))
                        .catch(err => reject(err))
                )
        });

        const handleIncomingMessage = (ctx) => {
            const event = ctx.data.event;
            if (event === 'create' || event === 'update' || event === 'delete') {
                const message = ctx.data.message;
                handleIncomingMessageFunction(message);
            }
        };

        subscriptionRef.on('publication', handleIncomingMessage);
        subscriptionRef.subscribe();
    },

    disconnectFromCentrifuge() {
        if (subscriptionRef) {
            subscriptionRef.removeAllListeners();
            subscriptionRef.unsubscribe();
            subscriptionRef = null;
        }
        if (centrifugeRef) {
            centrifugeRef.disconnect();
            centrifugeRef = null;
        }
    }
};
