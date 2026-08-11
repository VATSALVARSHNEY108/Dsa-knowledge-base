# Terraform Cheat Sheet

Quick reference for HashiCorp Terraform: HCL syntax, lifecycle commands, state,
modules, patterns, and best practices.

## Core Concepts

- **Infrastructure as Code (IaC)**: Define infrastructure declaratively in
  code; version it like application code.
- **Declarative**: You describe the *desired end state*; Terraform figures out
  how to get there.
- **HCL**: HashiCorp Configuration Language, Terraform's purpose-built DSL.
- **Providers**: Plugins that talk to APIs (aws, azurerm, google, github).
- **Resources**: Components you manage: `aws_instance`, `azurerm_vm`, etc.
- **Data sources**: Read existing infrastructure that Terraform does not own.
- **Terraform state**: A record of your real-world resources, stored in
  `terraform.tfstate`.
- **Plan vs apply**: `plan` shows changes; `apply` executes them; `destroy`
  removes them.

## HCL Core Syntax

```hcl
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "my-tfstate"
    key    = "infra/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "web-server"
  }
}

output "public_ip" {
  value = aws_instance.web.public_ip
}
```

## Lifecycle Commands

| Command | Purpose |
|---------|---------|
| `terraform init` | Download providers and modules, init backend. First command to run. |
| `terraform fmt` | Format `.tf` files to canonical style. |
| `terraform validate` | Check syntax and internal consistency. |
| `terraform plan` | Preview changes; reads state + config, reports diff. |
| `terraform apply` | Execute the plan; can run with `-auto-approve`. |
| `terraform destroy` | Remove all resources managed by config. |
| `terraform show` | Inspect state or saved plan, human readable. |
| `terraform state list` | List resources in state. |
| `terraform state rm` | Remove a resource from state (not from infra). |
| `terraform import` | Bring existing infrastructure into state. |
| `terraform output` | Print output values. |
| `terraform console` | Interactive expression evaluation. |

> Always run `terraform init` in a fresh clone before anything else, and keep
> the backend config present so everyone shares one state.

## State Management

- **`terraform.tfstate`**: Only source of truth for what exists in the world.
- **Local state**: Default, single file. Fine for learning; risky for teams.
- **Remote backend**: Recommended. Store state in `s3`, `azurerm`, or `gcs`;
  pair with DynamoDB table for locking.
- **State locking**: Prevents two users from applying simultaneously.
- **Refresh**: Reads real-world state to detect drift (`-refresh-only`).
- **Drift**: Differences between state and actual cloud resources.

```hcl
resource "aws_dynamodb_table" "lock" {
  name           = "terraform-lock"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
```

> Never edit `terraform.tfstate` by hand. Use `terraform state` commands.

## Variables and Outputs

```hcl
variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_types" {
  type    = list(string)
  default = ["t2.micro"]
}

variable "tags" {
  type = map(string)
  default = {
    owner = "platform"
  }
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "endpoints" {
  value = {
    web = aws_instance.web.public_dns
  }
}
```

- **Input variables**: Override via `-var`, `-var-file`, env vars
  (`TF_VAR_<name>`), or `terraform.tfvars`.
- **Outputs**: Expose values for other modules and for scripts to consume.
- **Local values**: `locals { name = "..." }`, reusable expressions within a
  module.
- **Sensitive marking**: `sensitive = true` hides a value from plan/output.

## Core Resources Snapshot

| Provider | Resource Pattern | Example Use |
|----------|------------------|-------------|
| AWS | `aws_instance` | EC2 VM |
| AWS | `aws_vpc`, `aws_subnet` | Networking |
| AWS | `aws_s3_bucket` | Object storage |
| Azure | `azurerm_resource_group` | Resource group |
| Azure | `azurerm_virtual_machine` | VM |
| Google | `google_compute_instance` | Compute Engine VM |
| Google | `google_storage_bucket` | Storage bucket |
| Any | `null_resource` | Run provisioners/scripts |
| Any | `data.*` | Read existing resources |

## Resource Meta-Arguments

- **`depends_on`**: Explicit dependency ordering.
- **`count`**: Create N similar resources (`count.index` to index them).
- **`for_each`**: Iterate over a map/set; each key gets its own resource.
- **`provider`**: Assign a resource to a specific (aliased) provider.
- **`lifecycle`**: Blocks like `create_before_destroy`, `prevent_destroy`.
- **`provisioner`**: Run scripts on a resource (last resort; prefer user_data).

```hcl
resource "aws_instance" "web" {
  for_each = {
    app-a = "t2.micro"
    app-b = "t3.micro"
  }
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = each.value

  lifecycle {
    prevent_destroy = true
  }
}
```

## Modules

- **Module**: A reusable, self-contained folder of Terraform config.
- **Root module**: Your working directory. **Child modules**: referenced via
  the `module` block.
- **Where used**: Provide a tight interface with input variables + outputs;
  wrap the underlying complexity.
- **Sources**: Local path, Git repo, or the Terraform Registry.

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "main"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.10.0/24", "10.0.20.0/24"]
}
```

## Common Patterns

- **Environments via workspaces**: `terraform workspace new dev`, `prod`;
  same code, separate state.
- **Environments via directories**: Separate folders (`envs/dev`, `envs/prod`)
  for strong isolation.
- **Behind a proxy**: Set `TF_HTTP_PROXY`, `HTTPS_PROXY` env vars if your CI
  runs behind one.
- **Lookups**: `lookup({a=1}, keys)`, `merge()` for maps.
- **Conditional + count**: `count = var.enabled ? 1 : 0` to toggle resources.
- **Tags everywhere**: Pass a `tags` map to tag every resource (unify with
  provider default_tags).
- **Remote state data**: Read another stack's outputs via `terraform_remote_state`.

> Prefer modules from the Terraform Registry over hand-rolled ones, and pin
> their versions.

## Best Practices

- Always run `terraform fmt` and `terraform validate` before applying.
- Put `.tfstate` files, `.tfvars` with secrets, and `*.tfstate.*` in
  `.gitignore`.
- Use remote state with locking on shared projects.
- Keep secrets out of code; read from env vars or a secret store.
- Use `terraform plan -out=plan.tfplan` and apply exactly that plan in CI.
- Prefer `for_each` over `count` when keys are stable.
- Split config into small modules with narrow, documented interfaces.
- Tag all resources for cost tracking and ownership.
- Pin provider and module versions with exact or `~>` ranges.
- Run `terraform validate` inside CI for every push.

## Common Pitfalls

- Committing `terraform.tfstate` or `.tfvars` files containing secrets.
- No state locking; two engineers `apply` at once and corrupt state.
- `count` changes reordering an existing list destroy/recreate plan.
- Using `terraform destroy` in the wrong directory/workspace.
- Writing provider logic in bash provisioners instead of HCL.
- Hard-coding secrets or environment-specific values into modules.
- Not running `terraform init` after changing provider or module versions.

## Interview Tips

- **Explain plan/apply/destroy** and the role of state in one breath.
- **Why remote state?** Team collaboration, locking, and disaster recovery.
- **count vs for_each**: for_each with stable map keys avoids index confusion.
- **"Terraform is declarative"** — you state the end state, not the steps.
- **Mention `terraform import`** for adopting brownfield infrastructure.
- **Know when to use data sources** vs creating a resource from scratch.