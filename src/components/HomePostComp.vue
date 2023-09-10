<template>
    <div class="blog-wrapper no-user">
        <div class="blog-content" :class="{'bgWhite': post.bgWhite}">
            <div>
                <h2>{{ post.title }}</h2>

                <p>{{ post.description }}</p>

                <router-link class="link link-light" :to="{name: post.routerLink}">{{ post.buttonText }} <i
                        class="material-icons arrow arrow-light">arrow_forward</i></router-link>

            </div>
        </div>
        <div class="blog-photo">
            <img :src="require(`../assets/${post.photo}.jpg`)" alt="">
        </div>
    </div>
</template>

<script>
export default {

    props: [
        "post"
    ]

}
</script>

<style lang="scss" scoped>
.blog-wrapper {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.6);

    @media (min-width: 700px) {
        min-height: 650px;
        max-height: 650px;
        flex-direction: row;
    }

    .bgWhite{
        background: #6d6c6ce6;
        color: white;
        .link {
            color: white;
            }
    }

    .blog-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-content: center;
        align-items: center;
        flex: 4;
        order: 2;

        @media (min-width: 700px) {
            order: 1;
        }

        @media (min-width: 800px) {
            flex: 3;
        }

        div {
            max-width: 375px;
            padding: 72px 24px;

            @media (min-width: 700px) {
                padding: 0 24px;
            }

            h2 {
                font-size: 32px;
                font-weight: 520;
                text-transform: uppercase;
                margin-bottom: 24px;

                @media (min-width: 700px) {
                    font-size: 40px;
                }
            }

            p {
                font-size: 15px;
                font-weight: 300px;
                line-height: 1.7;
            }

            .content-preview {
                font-size: 13px;
                max-height: 24px;
                width: 250px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .link {
                display: inline-flex;
                align-content: center;
                margin-top: 32px;
                padding-bottom: 4px;
                border-bottom: 1px solid transparent;
                transition: .5s ease-in all;

                &:hover {
                    border-bottom-color: #303030;
                }
            }

            .link-light {
                &:hover {
                    border-bottom-color: #000;
                }
            }
        }
    }

    .blog-photo {
        order: 1;
        flex: 3;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.6);

        @media (min-width: 700px) {
            order: 2;
        }

        @media (min-width: 800px) {
            flex: 4;
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .link,
    .link-light {
        color: #303030;
    }

}
</style>