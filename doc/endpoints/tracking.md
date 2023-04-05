# Tracking

## Create Viewed Link By User Data

**URL** : `/viewed-link-user`

**Method** : `POST`

**Auth required** : Yes

**Permissions required** : None

**Data Example**:
```json
{
    "userUuid": "XXXXXX",
    "linkUuid": "XXXXXX"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Data created!"
}
```

### Error Response

**Code** : `400 Bad request`
**Code** : `400 User not found`
**Code** : `400 Link not found`
**Code** : `403 Data already exists!`
**Code** : `500 OK`


## Get Viewed Link By User In This Cycle

**URL** : `/viewed-links-in-current-cycle`

**Method** : `GET`

**Auth required** : Yes

**Permissions required** : None

**Query params** :

- 'userUuid=XXXX'

### Success Response

**Code** : `200 OK`

**Content example**

```json
[
    {
            "id": 1,
            "uuid": "f2c23145-e292-4149-a997-918566608b76",
            "title": "title1",
            "link": "https://www.butterfy.me/",
            "categories": [
                {
                    "id": 1,
                    "name": "XXX",
                    "slug": "xxx"
                }
            ]
            ...
    }
]
```

### Error Response

**Code** : `400 Bad request`
**Code** : `500 Error`
