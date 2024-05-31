from django.db import models


class NFT(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=True)
    description = models.CharField(max_length=100, null=True)
    created_by = models.CharField(max_length=20, null=True)
    creative_url = models.TextField(null=True)
    is_active = models.BooleanField(null=True)
    account_id = models.CharField(max_length=100, null=True)
    nft_id = models.CharField(max_length=100, null=True)
    created_on = models.DateTimeField(null=True, auto_now_add=True)
    modified_on = models.DateTimeField(null=True, auto_now_add=True)

    class Meta:
        db_table = "nft"


class Ownership(models.Model):
    id = models.AutoField(primary_key=True)
    nft_id = models.ForeignKey(NFT, on_delete=models.CASCADE, null=True)
    recipient_id = models.CharField(max_length=100, null=True)
    created_on = models.DateTimeField(null=True, auto_now_add=True)
    modified_on = models.DateTimeField(null=True, auto_now_add=True)

    class Meta:
        db_table = "ownership"



# class Sponsors(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=20, null=True)
#     about = models.TextField(null=True)
#     logo = models.TextField(null=True)
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
#     created_on = models.DateTimeField(null=True, auto_now_add=True)
#     modified_on = models.DateTimeField(null=True, auto_now_add=True)
#
#     class Meta:
#         db_table = "sponsors"
#
#
# class Books(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=20, null=True)
#     about = models.TextField(null=True)
#     cover_url = models.TextField(null=True)
#     url = models.TextField(null=True)
#     sponsors = models.ManyToManyField(Sponsors, null=True)
#     drawings = models.ManyToManyField(Drawings, null=True)
#     current_sponsors = models.IntegerField(null=True, default=0)
#     total_sponsors = models.IntegerField(null=True, default=1)
#     is_published = models.BooleanField(null=True)
#     created_on = models.DateTimeField(null=True, auto_now_add=True)
#     modified_on = models.DateTimeField(null=True, auto_now_add=True)
#
#     class Meta:
#         db_table = "books"

