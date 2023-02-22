# Links

## Get links

By default return 20 links sorted randomly

**URL** : `/links`

**Method** : `GET`

**Auth required** : No

**Permissions required** : None

**Query params** :

- 'sort=-date' (sorted newest first, 6 by 6)
- 'categories=categories1,categories2,...' (filter by categories)
- 'page=2' (pagination to sorted by date, 6 by 6)

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "links": [
        {
            "id": 1,
            "uuid": "f2c23145-e292-4149-a997-918566608b76",
            "title": "title1",
            "link": "https://www.butterfy.me/",
            "image": "https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/5fe2726881e6e52053a0217c_Butterfy_Logo-p-500.png",
            "date": "2022-12-15T11:33:55.110Z",
            "username": "admin"
        }
    ],
    "total": 10
}
```

### Error Response

**Code** : `500 OK`


## Get link by id

**URL** : `/links/:id`

**Method** : `GET`

**Auth required** : No

**Permissions required** : None

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "id": 47,
    "uuid": "40608fde-fc54-4ff0-a8a5-29c35fcd7226",
    "title": "title1",
    "link": "https://www.butterfy.me/",
    "image": "https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/5fe2726881e6e52053a0217c_Butterfy_Logo-p-500.png",
    "date": "2023-01-23T17:45:45.684Z",
    "username": "admin",
    "categories": [
        {
            "id": 3,
            "name": "Environment",
            "slug": "environment"
        }
    ]
}
```

### Error Response

**Code** : `400 Link not exists`

**Code** : `500 OK`


## Get preview link data

**URL** : `/link-preview-data`

**Method** : `POST`

**Auth required** : Yes

**Permissions required** : None

**Data Example**:
```json
{
  "url": "http://ogp.me/"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "ogTitle": "Open Graph protocol",
    "ogType": "website",
    "ogUrl": "https://ogp.me/",
    "ogDescription": "The Open Graph protocol enables any web page to become a rich object in a social graph.",
    "ogImage": [
        {
            "url": "https://ogp.me/logo.png",
            "width": 300,
            "height": 300,
            "type": "image/png"
        }
    ]
}
```

### Error Response

**Code** : `400 Bad request` (url is empty)
**Code** : `500 OK`
