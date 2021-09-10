import React from 'react'
import Head from 'next/head'

import { getPageTitle, getAllPagesInSpace } from 'notion-utils'
import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

const notion = new NotionAPI()

export const getStaticProps = async (context) => {
  const pageId = context.params.pageId as string
  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const rootNotionPageId = 'wangzairong-8710ea0616e3414fb0761e6916aa5f12'
  const rootNotionSpaceId = '1ad5ad28-cb4d-4c0b-9e11-ac364a18739c'

  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.
  const pages = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion),
    {
      traverseCollections: false
    }
  )

  const paths = Object.keys(pages).map((pageId) => `/${pageId}`)

  return {
    paths,
    fallback: true
  }
}

export default function NotionPage({ recordMap }) {
  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)
  console.log(title, recordMap)

  return (
    <>
      <Head>
        <meta name='description' content='React Notion X demo renderer.' />
        <title>{title}</title>
      </Head>

      <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
    </>
  )
}
