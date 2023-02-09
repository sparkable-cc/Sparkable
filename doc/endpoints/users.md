# Users

## Create User

**URL** : `/user`

**Method** : `POST`

**Auth required** : No

**Permissions required** : None

#### Success Response

**Code** : `201 OK`

**Content example**

```json
{
  "user": [
    {
      "id": 1,
      "email": "email",
      "username": "admin",
      "password": "passwordHash"
    }
  ]
}
```

#### Error Response

**Code** : `400 BAD REQUEST`

**Code** : `403 USER EXISTS`

**Code** : `500 INTERNAL SERVER ERROR`

## Sign in User

**URL** : `/signin`

**Method** : `POST`

**Auth required** : No

**Permissions required** : None

#### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "access_token": "xxxxxxxxxxx",
    "expires_in": 86400,
    "token_type": "Bearer"
}
```

#### Error Response

**Code** : `401 UNAUTHORIZED`

**Code** : `500 INTERNAL SERVER ERROR`


## Recovery password

**URL** : `/recovery-password`

**Method** : `POST`

**Data Example**:
```json
{
    "email": "test@test.com"
}
```

**Auth required** : No

**Permissions required** : None

#### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "The mail was sent!"
}
```

#### Error Response

**Code** : `400 BAD REQUEST` (Email is empty)

**Code** : `200 OK` (When Email not exists in database)

**Code** : `500 INTERNAL SERVER ERROR`