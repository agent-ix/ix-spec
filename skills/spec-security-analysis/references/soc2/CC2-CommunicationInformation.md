# CC2 - Communication and Information

**Category**: Common Criteria  
**Focus**: Information quality and communication

## When to Apply

Apply CC2 when your component:
- Generates or processes information used in control decisions
- Communicates with external parties (APIs, events, notifications)
- Provides status or health information

## Controls

| Control | Name | Description |
|---------|------|-------------|
| CC2.1 | Relevant Information | Entity obtains or generates and uses relevant, quality information |
| CC2.2 | Internal Communication | Entity internally communicates information including objectives and responsibilities |
| CC2.3 | External Communication | Entity communicates with external parties regarding matters affecting functioning |

## Mapping Guidance

For software components, map to:
- **API documentation requirements** → CC2.1, CC2.3
- **Health/status endpoints** → CC2.1
- **Event publishing** → CC2.2, CC2.3
- **Error messages/responses** → CC2.3
