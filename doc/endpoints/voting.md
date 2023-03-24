# Voting

## Get voting status

**URL** : `/voting-status`

**Method** : `POST`

**Auth required** : No

**Permissions required** : None

**Data Example**:
```json
{
    "date": "2023-04-06 12:00:00"
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
   "timeUntilNextVoting":"240:00:00"
}
```

#### Error Response

**Code** : `400 INVALID DATE`

**Code** : `400 DATE OUTSIDE OF VOTING CYCLES`

**Code** : `500 INTERNAL SERVER ERROR`
