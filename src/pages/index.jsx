import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import styled from "@emotion/styled"
import { Header, PostList } from "components"
import { Layout } from "layouts"
import { NavBar } from "../layouts"

const PostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`
const FilterSection = styled.section`
  margin: 4rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  label {
    margin-bottom: 0.5rem;
  }
`

const Index = ({ data }) => {
  const { edges } = data.allMdx

  const allStores = React.useRef(edges)
  const [filterableStores, setFilterableStores] = React.useState(edges)

  const handleCityChange = e => {
    const selectedCity = e.target.value
    let updatedStores
    if (selectedCity !== "All") {
      updatedStores = allStores.current.filter(
        store => store.node.frontmatter.city === selectedCity
      )
    } else {
      updatedStores = allStores.current
    }

    setFilterableStores(updatedStores)
  }
  return (
    <Layout>
      <Helmet title={"Quad Citizens Supporting Local Businesses"} />
      <Header title="Quad Citizens Supporting Local Businesses">
        {data.site.siteMetadata.title}
      </Header>
      <NavBar />
      <FilterSection>
        <label for="city-filter">Filter by City</label>
        <select id="city-filter" onChange={handleCityChange}>
          <option value="All">All Cities</option>
          <option value="Davenport">Davenport</option>
          <option value="Rock Island">Rock Island</option>
          <option value="Bettendorf">Bettendorf</option>
          <option value="Moline">Moline</option>
          <option value="East Moline">East Moline</option>
        </select>
      </FilterSection>
      <PostWrapper>
        {filterableStores.map(({ node }) => {
          const { id, excerpt, frontmatter } = node
          const { cover, path, title, date, city, tags } = frontmatter
          return (
            <PostList
              key={id}
              cover={cover.childImageSharp.fluid}
              path={path}
              title={title}
              city={city}
              date={date}
              excerpt={excerpt}
              tags={tags}
            />
          )
        })}
      </PostWrapper>
    </Layout>
  )
}

export default Index

Index.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            excerpt: PropTypes.string,
            frontmatter: PropTypes.shape({
              cover: PropTypes.object.isRequired,
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              date: PropTypes.string.isRequired,
              tags: PropTypes.array,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      sort: { order: ASC, fields: [frontmatter___city, frontmatter___title] }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 75)
          frontmatter {
            title
            path
            tags
            city
            date(formatString: "MM.DD.YYYY")
            cover {
              childImageSharp {
                fluid(
                  maxWidth: 1000
                  quality: 90
                  traceSVG: { color: "#2B2B2F" }
                ) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`
