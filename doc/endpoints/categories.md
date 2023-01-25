# Categories

## Get categories

**URL** : `/categories`

**Method** : `GET`

**Auth required** : No

**Permissions required** : None

**Query params** : None

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "categories": [
        {
            "id": 1,
            "name": "Art & Culture",
            "slug": "art-and-culture"
        },
        {
            "id": 2,
            "name": "Business & Economy",
            "slug": "business-and-economy"
        },
        {
            "id": 3,
            "name": "Environment",
            "slug": "environment"
        },
        {
            "id": 4,
            "name": "Mind & Body",
            "slug": "mind-and-body"
        },
        {
            "id": 6,
            "name": "Technology",
            "slug": "technology"
        },
        {
            "id": 7,
            "name": "Other",
            "slug": "other"
        },
        {
            "id": 5,
            "name": "Society",
            "slug": "society"
        }
    ],
    "total": 7
}
```

### Error Response

**Code** : `500 OK`
