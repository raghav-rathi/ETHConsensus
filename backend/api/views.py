import logging
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import viewsets, status
from api.models import NFT, Ownership
from api.serializers import NFTSerializer, OwnershipSerializer
import datetime
import os
import replicate
from io import BytesIO
from dotenv import load_dotenv
import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from io import BytesIO
from api.s3_handler import S3Handler

load_dotenv()


class NFTViewSet(viewsets.ModelViewSet):
    queryset = NFT.objects.all()
    serializer_class = NFTSerializer

    def create(self, request, *args, **kwargs):

        raw_sketch = request.data.pop("image")[0]
        uploader = S3Handler(os.getenv("AWS_BUCKET"))
        raw_sketch.file.seek(0)
        file_content = raw_sketch.file.read()
        creative_url = uploader.upload_file_to_s3(BytesIO(file_content), f'raw_sketch/{request.data.get("name", "")}.jpg')
        request.data["creative_url"] = creative_url
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)




class OwnershipViewSet(viewsets.ModelViewSet):
    queryset = Ownership.objects.all()
    serializer_class = OwnershipSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        nft_obj = NFT.objects.get(pk=serializer.data["nft_id"])
        send_congratulatory_email(sponsor_name=serializer.data["recipient_id"], 
                                    nft_id=str(nft_obj.nft_id), nft_url=str(nft_obj.creative_url), donation_amount=0)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


def send_congratulatory_email(sponsor_name, nft_id, nft_url, donation_amount):
    # Creating the message
    message = MIMEMultipart()
    message['From'] = os.getenv("ADMIN_EMAIL")
    message['To'] = os.getenv("RECEIVER_EMAIL")
    message['Subject'] = "IP usage detected"

    # Email body
    email_body = f"""
            <html>
            <head>
            <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            h2 {{
                color: #005691;
            }}
            p {{
                margin: 18px 0;
            }}
            </style>
            </head>
            <body>

            <p>Hello,</p>

            <p>We detected usage of one of your IPs by ACCOUNT = <strong>{sponsor_name}</strong>. </p>
            <p> NFT ID = <strong>{nft_id}</strong> </p>
            <p> <img src={nft_url} style="width:200px;height:200px;"></img> </p>
            <p><strong>Split amount:</strong> ${donation_amount}</p>
            </body>
            </html>
            """
    message.attach(MIMEText(email_body, 'html'))

    # Sending the email
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT")), context=context) as server:
            server.login(os.getenv("ADMIN_EMAIL"), os.getenv("ADMIN_EMAIL_PASSWORD"))
            server.sendmail(os.getenv("ADMIN_EMAIL"), os.getenv("RECEIVER_EMAIL"), message.as_string())
            print("Email successfully sent!")
    except Exception as e:
        print(f"Failed to send email. Error: {e}")