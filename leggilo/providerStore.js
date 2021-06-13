const webService = require('./webService');
const moment = require('moment');

const config = {
    reddit: {
        urlParams: 'top.json?limit=10&t=day',
        processor: ''
    },
    StackOverflow: {
        decompress: true
    }
};

const getProviders = () => {
    return {
        1: {
            id: 1,
            root: 'reddit',
            name: 'Reddit: /r/learnprogramming',
            url: 'https://www.reddit.com/r/learnprogramming',
            thumbnail: 'https://styles.redditmedia.com/t5_2r0ij/styles/communityIcon_yor9myhxz5x11.png'
        },
        2: {
            id: 2,
            root: 'reddit',
            name: 'Reddit: /r/javascript',
            url: 'https://www.reddit.com/r/javascript',
            thumbnail: 'https://a.thumbs.redditmedia.com/zDOFJTXd6fmlD58VDGypiV94Leflz11woxmgbGY6p_4.png'
        },
        3: {
            id: 3,
            root: 'Hackernoon',
            name: 'Hackernoon',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcdn.hackernoon.com%2Ffeed',
            thumbnail: 'https://hackernoon.com/hn-icon.png'
        },
        4: {
            id: 4,
            root: 'StackOverflow',
            name: 'Stack Overflow',
            url: 'https://api.stackexchange.com/2.2/questions?order=desc&sort=week&site=stackoverflow',
            thumbnail: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/icon-48.png'
        },
        5: {
            id: 5,
            root: 'HashNode',
            name: 'HashNode',
            url: 'https://api.hashnode.com/?query=%7BstoriesFeed%28type%3ABEST%29%7Btitle%2Cslug%2CresponseCount%2CcoverImage%2Cbrief%2CdateAdded%2Ccuid%2Cauthor%7Bname%2CblogHandle%2CpublicationDomain%7D%2CpartOfPublication%7D%7D',
            thumbnail: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1611902473383/CDyAuTy75.png?auto=compress'
        },
    };
}

const getProviderById = (id) => {
    const providers = getProviders();
    return providers[id];
}

const shortenDescription = (description) => {
    if (description && typeof description === 'string') {
        return description.length > 255 ? `${description.substring(0, 255)} ...` : description;
    }
}

const getProcessorFunction = (providerId) => {
    let uid = 0;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const provider = getProviderById(providerId);
    const functions = {
        'redditProcessor': function (data) {
            const posts = data.body.data.children;
            return posts.map(postData => {
                const post = postData.data;
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: moment.unix(post.created_utc).format(dateFormat),
                    link: post.url,
                    author: post.author,
                    description: shortenDescription(post.selftext),
                    tags: [],
                    thumbnail: provider.thumbnail,
                    image: null,
                    metadata: {comments: post.num_comments, upvotes: post.ups, downvotes: post.downs}
                }
            });
        },
        'HackernoonProcessor': function (data) {
            const posts = data.body.items ? data.body.items : [];
            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: post.pubDate,
                    link: post.link,
                    author: post.author,
                    description: shortenDescription(post.description),
                    tags: post.categories,
                    thumbnail: provider.thumbnail,
                    image: null,
                    metadata: {}
                }
            });
        },
        'StackOverflowProcessor': function (data) {
            const posts = data.body.items ? data.body.items : [];
            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: moment.unix(post.creation_date).utc().format(dateFormat),
                    link: post.link,
                    author: post.owner.display_name,
                    description: 'Read more on Stack Overflow ...',
                    tags: post.tags,
                    thumbnail: provider.thumbnail,
                    image: null,
                    metadata: {comments: post.answer_count, score: post.score, views: post.view_count}
                }
            });
        },
        'HashNodeProcessor': function (data) {
            const posts = data.body.data.storiesFeed ? data.body.data.storiesFeed : [];

            function getLink(post) {
                return `https://${post.author.blogHandle}.hashnode.dev/${post.slug}`;
            }

            return posts.map(post => {
                uid++;
                return {
                    id: `${provider.id}-${uid}`,
                    title: post.title,
                    date: moment(post.dateAdded).format(dateFormat),
                    link: getLink(post),
                    author: post.author.name,
                    description: shortenDescription(post.brief),
                    tags: [],
                    thumbnail: provider.thumbnail,
                    image: post.coverImage,
                    metadata: {comments: post.responseCount, score: post.totalReactions, views: post.view_count}
                }
            });
        },
    }
    return functions[`${provider.root}Processor`];
}

const fetchPostsForProvider = async (providerId) => {
    const provider = getProviderById(providerId);
    let urlExtraParams = '';
    let decompress = false;
    if (config[provider.root]) {
        urlExtraParams = config[provider.root].urlParams ? `/${config[provider.root].urlParams}` : '';
        decompress = config[provider.root].decompress;
    }
    const articleData = await webService.fetchData(`${provider.url}${urlExtraParams}`, decompress);
    return getProcessorFunction(provider.id)(articleData);
}

const providerStore = {
    fetchProviders: getProviders,
    fetchProviderPosts: fetchPostsForProvider
};

module.exports = providerStore;
