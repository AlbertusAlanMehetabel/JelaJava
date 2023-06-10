FROM python:3.9-slim
WORKDIR /app
ENV PORT 5000
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "app.py"]