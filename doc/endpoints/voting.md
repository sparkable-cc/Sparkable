# Voting

## Get voting status

**URL** : `/voting-status`

**Method** : `POST`

**Auth required** : No

**Permissions required** : None

**Data Example**:
```json
{
    "userUuid?": "xxxxxxxx"
}
```

#### Success Response

**Code** : `200 OK`

**Content example**

```json
{
   "openVoting":false,
   "round":1,
   "nextOpenVotingDate":"2023-04-06T00:00:00.000Z",
   "daysUntilNextVoting":10,
   "timeUntilNextVoting":"240:00:00",
   "userHasVoted": false
}
```

#### Error Response

**Code** : `400 INVALID DATE`
**Code** : `400 DATE OUTSIDE OF VOTING CYCLES`
**Code** : `500 INTERNAL SERVER ERROR`


## Create votes

**URL** : `/votes`

**Method** : `POST`

**Auth required** : Yes

**Permissions required** : None

**Data Example**:
```json
{
    "userUuid": "xxxxxxx",
    "votes": [ {"linkUuid": "xxx1"}, {"linkUuid": "xxx2"}, ...]
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Voting created!"
}
```

### Error Response

**Code** : `401 Unauthorized`
**Code** : `400 Bad request`
**Code** : `400 Number of votes exceeded` (7 max)
**Code** : `403 User has not opened any link`
**Code** : `500 OK`
