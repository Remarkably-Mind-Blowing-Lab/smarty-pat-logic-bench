import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import {Col, Row, Image} from 'antd';
import styles from './index.module.css';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
          <Row>
              <Col span={4}>
                  <Image
                      width={200}
                      src="img/smarty-pat-no-bg.webp"
                  />
              </Col>
              <Col span={1}></Col>
              <Col span={19}>
                  <Heading as="h1" className="hero__title" style={{textAlign: "left"}}>
                      {siteConfig.title}
                  </Heading>
                  <p className="hero__subtitle" style={{textAlign: "left"}}>{siteConfig.tagline}</p>
              </Col>
          </Row>


          {/*<div className={styles.buttons}>*/}
        {/*  <Link*/}
        {/*    className="button button--secondary button--lg"*/}
        {/*    to="/docs/intro">*/}
        {/*    Docusaurus Tutorial - 5min ⏱️*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="A logic reasoning benchmark for LLMs">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
