ARG ENVIRONMENT=Production

# Development stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS development

WORKDIR /app

# Copy csproj and restore first (faster builds)
COPY *.csproj ./
RUN dotnet restore

# Copy everything else
COPY . .

EXPOSE 5000

CMD ["dotnet", "watch", "run", "--urls=http://0.0.0.0:5000"]

# Production stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy csproj and restore
COPY *.csproj ./
RUN dotnet restore

# Copy everything
COPY . .

# Build the application
RUN dotnet publish -c Release -o /app/publish

# Use runtime image for production
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS production

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5000

ENV ASPNETCORE_ENVIRONMENT=Production

CMD ["dotnet", "BAMS-backend.dll"]
