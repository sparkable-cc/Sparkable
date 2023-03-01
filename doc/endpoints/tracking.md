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
**Code** : `400 User not fount`
**Code** : `400 Link not fount`
**Code** : `403 Data already exists!`
**Code** : `500 OK`
