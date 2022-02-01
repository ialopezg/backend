# Pagination

The term pagination is used when content on websites is divided into several pages, e.g. for long lists of products in an online shop.  view the separate pages. 

## Specification

| Properties      | Type        |  Description |
| :---            |:----        |:----         |
| page            | Number      | Current page|
| take            | Number      | Records per page|
| itemCount       | Number      | Record count, regularly is the total of records stored in current table|
| pageCount       | Number      | Total pages |
| hasPreviousPage | Boolean     | Whether if current object from current page position, number, has previous page |
| hasNextPage     | Boolean     | Whether if current object from current page position, number, has next page |

