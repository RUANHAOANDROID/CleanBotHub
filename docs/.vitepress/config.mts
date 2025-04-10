// .vitepress/config.js
import {defineConfig} from 'vitepress'
import {withMermaid} from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
    title: "CleanBot Hub",
    description: "A VitePress Site",
    base: '/',
    outDir: '../dist',
    vite: {
        publicDir: "../public",
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Design', link: '/design/'},
        ],
        sidebar: {
            '/design/': [
                {
                    text: 'design',
                    items: [
                        {text: 'architecture', link: '/design/'},
                        {text: 'stage', link: '/design/stage'},
                        {text: 'Robot Control API Server', link: '/design/server-control'},
                        {text: 'WebHook Server', link: '/design/server-webhook'},
                        {text: 'Prometheus', link: '/design/prometheus'},
                        {text: 'HPA', link: '/design/hpa'},
                        {text: 'CI/CD', link: '/design/cicd'},
                    ]
                }
            ],
        },
        socialLinks: [
            //{icon: 'github', link: 'https://github.com/RUANHAOANDROID'}
        ]
    },
    mermaid: {
        // opt
    }
}));