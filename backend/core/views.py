from django.shortcuts import render
from django.http import JsonResponse
from .db import test_collection

def ping(request):
    test_collection.insert_one({"message": "pong"})

    last=test_collection.find().sort("_id", -1).limit(1)
    message=list(last)[0]["message"]

    return JsonResponse({"message": message})

# Create your views here.
