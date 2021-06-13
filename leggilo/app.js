const moment = require('moment');
const https = require('https');
const zlib = require('zlib');

const config = {
    reddit: {
        urlParams: 'top.json?limit=10&t=day',
        processor: ''
    },
    StackOverflow: {
        decompress: true
    }
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.leggiloHandler = async (event, context) => {

    const reqParams = event.queryStringParameters;
    let response = {};

    try {
        if (reqParams.mode === 'providers') {
            response = getProviders();
        } else if (reqParams.providerId) {
            const provider = getProviderById(reqParams.providerId);
            let urlExtraParams = '';
            let decompress = false;
            if (config[provider.root]) {
                urlExtraParams = config[provider.root].urlParams ? `/${config[provider.root].urlParams}` : '';
                decompress = config[provider.root].decompress;
            }
            const articleData = await fetchArticleData(`${provider.url}${urlExtraParams}`, decompress);
            response = getProcessorFunction(provider.root)(articleData);
        } else {
            response = {};
        }
    } catch (err) {
        return err;
    }
    return {
        statusCode: 200, body: JSON.stringify(response), headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3001'
        }
    };
};

async function fetchArticleData(url, decompress) {
    return await new Promise((resolve, reject) => {
        let dataString = '';
        const req = https.get(url, function (res) {

            const onData = (data) => {
                dataString += data.toString();
            }
            const onEnd = () => {
                resolve({
                    statusCode: 200,
                    body: JSON.parse(dataString)
                });
            }
            if (decompress) {
                const gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                gunzip.on('data', onData).on("end", onEnd);
            } else {
                res.on('data', onData).on('end', onEnd);
            }
        });

        req.on('error', (e) => {
            reject({
                statusCode: 500,
                body: 'Something went wrong!'
            });
        });
    });
}

function getProviders() {
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

function getProviderById(id) {
    const providers = getProviders();
    return providers[id];
}

function getProviderByRootName(rootName) {
    const providers = getProviders();
    const filteredProviders = Object.values(providers).filter(provider => provider.root === rootName);
    return filteredProviders ? filteredProviders[0] : {};
}

function shortedDescription(description) {
    if (description && typeof description === 'string') {
        return description.length > 255 ? `${description.substring(0, 255)} ...` : description;
    }
}

function getProcessorFunction(providerRoot) {
    let uid = 0;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const provider = getProviderByRootName(providerRoot);
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
                    description: shortedDescription(post.selftext), //TODO: Shorten this
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
                    description: shortedDescription(post.description),
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
                    description: shortedDescription(post.brief),
                    tags: [],
                    thumbnail: provider.thumbnail,
                    image: post.coverImage,
                    metadata: {comments: post.responseCount, score: post.totalReactions, views: post.view_count}
                }
            });
        },
    }
    return functions[`${providerRoot}Processor`];
}


