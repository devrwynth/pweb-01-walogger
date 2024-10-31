const express = require('express');
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());

const data = [{
    _data: {
        id: {
            fromMe: false,
            remote: '6283895262500@c.us',
            id: '3FFD52091E882D584884',
            _serialized: 'false_6283895262500@c.us_3FFD52091E882D584884'
        },
        viewed: false,
        body: 'selamat pagi',
        type: 'chat',
        t: 1729671362,
        notifyName: 'r',
        from: '6283895262500@c.us',
        to: '6285174388804@c.us',
        ack: 1,
        invis: false,
        isNewMsg: true,
        star: false,
        kicNotified: false,
        recvFresh: true,
        isFromTemplate: false,
        thumbnail: '',
        pollInvalidated: false,
        isSentCagPollCreation: false,
        latestEditMsgKey: null,
        latestEditSenderTimestampMs: null,
        mentionedJidList: [],
        groupMentions: [],
        isEventCanceled: false,
        eventInvalidated: false,
        isVcardOverMmsDocument: false,
        labels: [],
        hasReaction: false,
        ephemeralDuration: 0,
        ephemeralSettingTimestamp: 0,
        disappearingModeInitiator: 'chat',
        disappearingModeTrigger: 'chat_settings',
        viewMode: 'VISIBLE',
        productHeaderImageRejected: false,
        lastPlaybackProgress: 0,
        isDynamicReplyButtonsMsg: false,
        isCarouselCard: false,
        parentMsgId: null,
        isMdHistoryMsg: false,
        stickerSentTs: 0,
        isAvatar: false,
        lastUpdateFromServerTs: 0,
        invokedBotWid: null,
        bizBotType: null,
        botResponseTargetId: null,
        botPluginType: null,
        botPluginReferenceIndex: null,
        botPluginSearchProvider: null,
        botPluginSearchUrl: null,
        botPluginSearchQuery: null,
        botPluginMaybeParent: false,
        botReelPluginThumbnailCdnUrl: null,
        botMsgBodyType: null,
        requiresDirectConnection: null,
        bizContentPlaceholderType: null,
        hostedBizEncStateMismatch: false,
        senderOrRecipientAccountTypeHosted: false,
        placeholderCreatedWhenAccountIsHosted: false,
        links: []
        },
        mediaKey: undefined,
        id: {
            fromMe: false,
            remote: '6283895262500@c.us',
            id: '3FFD52091E882D584884',
            serialized: 'false_6283895262500@c.us_3FFD52091E882D584884'
        },
        ack: 1,
        hasMedia: false,
        body: 'selamat pagi',
        type: 'chat',
        timestamp: 1729671362,
        from: '6283895262500@c.us',
        to: '6285174388804@c.us',
        author: undefined,
        deviceType: 'web',
        isForwarded: undefined,
        forwardingScore: 0,
        isStatus: false,
        isStarred: false,
        broadcast: undefined,
        fromMe: false,
        hasQuotedMsg: false,
        hasReaction: false,
        duration: undefined,
        location: undefined,
        vCards: [],
        inviteV4: undefined,
        mentionedIds: [],
        groupMentions: [],
        orderId: undefined,
        token: undefined,
        isGif: false,
        isEphemeral: undefined,
        links: []
}];

app.get('/status', (req, res) => {
    res.json({
        status: "Backend Jalan",
        uptime: process.uptime()
    });
});

app.get('/users', (req, res) => {
    // res.json(data.map((user) => user.name));
    res.json({
        data
    });
});

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const response = data.find(d => d.id == id);

    if (!response) {
        res.status(404).json({
            error: "Gaada datanya wakk"
        });
        console.error();
    } else {
        res.status(200).json({
            data: response
        });
    }
});

app.listen(port, () => {
    console.log(`Backend PWEB pake express di http://localhost:${port}`);
});