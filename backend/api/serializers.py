from rest_framework import serializers
from .models import CoilEntry


def validate_ok_count(value):
    if value < 100 or value > 1000:
        raise serializers.ValidationError("Value must be between 100 and 1000")
    return value

def validate_hold_count(value):
    if value < 100 or value > 1000:
        raise serializers.ValidationError("Value must be between 100 and 1000")
    return value
def validate_rejecction_count(value):
    if value < 100 or value > 1000:
        raise serializers.ValidationError("Value must be between 100 and 1000")
    return value
def validate_diagonal_count(value):
    if value < 100 or value > 1000:
        raise serializers.ValidationError("Value must be between 100 and 1000")
    return value
class CoilEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CoilEntry
        fields = "__all__"

