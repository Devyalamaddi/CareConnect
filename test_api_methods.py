from omnidimension import Client

# Initialize client with API key
api_key = "y6sY3KaMTmzUtc5XCi_BJf5BMySgHCD_vI79cIEiEOE"
client = Client(api_key)

print("🔍 Exploring OmniDimension Client Methods")
print("=" * 50)

# Check what attributes and methods are available
print("📋 Client attributes:")
for attr in dir(client):
    if not attr.startswith('_'):
        print(f"  {attr}")

print("\n📋 Client type:", type(client))

# Check if call-related methods exist
print("\n🔍 Checking for call-related methods:")
call_methods = [attr for attr in dir(client) if 'call' in attr.lower()]
for method in call_methods:
    print(f"  {method}")

# Try to get more info about the client
try:
    print(f"\n📋 Client docstring:")
    print(client.__doc__)
except:
    print("No docstring available")

# Check if there's a calls attribute
if hasattr(client, 'calls'):
    print(f"\n✅ Found 'calls' attribute: {type(client.calls)}")
    print("📋 Calls methods:")
    for attr in dir(client.calls):
        if not attr.startswith('_'):
            print(f"  {attr}")

# Check if there's a call attribute
if hasattr(client, 'call'):
    print(f"\n✅ Found 'call' attribute: {type(client.call)}")
    print("📋 Call methods:")
    for attr in dir(client.call):
        if not attr.startswith('_'):
            print(f"  {attr}") 